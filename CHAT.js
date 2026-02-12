    const chatLog = document.getElementById("chat-log");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const converter = new showdown.Converter({tables: true, strikethrough: true });

    let isWaitingForResponse = false;
    let messageCount = 0;
    let retryCount = 0;
    const maxRetries = 3;

    // Function to get API key from user input
    function getApiKey() {
            return localStorage.getItem('google_api_key');
        }

    // Function to setup API key
    function setupApiKey() {
            const apiKey = prompt('Please enter your Google AI API key:\n\nGet your free API key from: https://makersuite.google.com/app/apikey');
    if (apiKey && apiKey.trim()) {
        localStorage.setItem('google_api_key', apiKey.trim());
    updateApiKeyStatus();
    alert('API key saved successfully! You can now start chatting.');
            } else if (apiKey !== null) {
        alert('Please enter a valid API key.');
            }
        }

    // Function to update API key status display
    function updateApiKeyStatus() {
            const statusDiv = document.getElementById('api-key-status');
    const hasKey = !!localStorage.getItem('google_api_key');
    if (hasKey) {
        statusDiv.style.display = 'flex';
    statusDiv.className = 'api-key-status';
    statusDiv.innerHTML = '<i class="fas fa-check"></i> API Key Configured';
            } else {
        statusDiv.style.display = 'none';
            }
        }

    // Initialize API key status on page load
    document.addEventListener('DOMContentLoaded', function() {
        updateApiKeyStatus();
        });

    async function sendMessage(isRetry = false) {
            const userQuestion = userInput.value.trim();
    if (userQuestion === "" || isWaitingForResponse) return;

    // Get API key
    const apiKey = getApiKey();
    if (!apiKey) {
                const setupKey = confirm('API key is required to use the chat feature. Would you like to set it up now?');
    if (setupKey) {
        setupApiKey();
                }
    return;
            }

    // Remove empty state on first message (not on retries)
    if (messageCount === 0 && !isRetry) {
                const emptyState = chatLog.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
            }

    if (!isRetry) {
        messageCount++;
    appendMessage('You', userQuestion, 'user');
    userInput.value = "";
            }

    isWaitingForResponse = true;
    sendButton.disabled = true;

    // Only create new bot message if not retrying
    let botMessageContainer, botContentDiv;
    if (!isRetry) {
        botMessageContainer = appendMessage('अध्यYAN AI', '', 'bot');
    botContentDiv = botMessageContainer.querySelector('.message-content');
            } else {
                // Find the last bot message for retry
                const messages = chatLog.querySelectorAll('.bot-message');
    botMessageContainer = messages[messages.length - 1];
    botContentDiv = botMessageContainer.querySelector('.message-content');
            }

            // Show appropriate loading message
            if (isRetry && retryCount > 0) {
        botContentDiv.innerHTML = `<div style="color: #f59e0b; margin-bottom: 12px;"><i class="fas fa-redo"></i> Retrying... (Attempt ${retryCount + 1}/${maxRetries})</div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
            } else {
        botContentDiv.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
            }

    try {
                const systemInstruction = 'You are a helpful chatbot for Computer Science Engineering students. Your task is to answer their questions accurately and concisely.';

    const payload = {
        contents: [
    {role: 'user', parts: [{text: `${systemInstruction}\nUser: ${userQuestion}\nAssistant:` }] }
    ],
    generationConfig: {
        temperature: 0.6
                    }
                };

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey);

    const response = await fetch(url, {
        method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
                });

    if (!response.ok) {
                    const errorText = await response.text().catch(() => '');
    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }

    const data = await response.json();
    const candidate = data.candidates && data.candidates[0];
    const parts = candidate && candidate.content && candidate.content.parts || [];
                const answer = parts.map(p => p.text || '').join('');

    // Simulate streaming by updating the content progressively
    let displayText = '';
    const chunkSize = 50;
    for (let i = 0; i < answer.length; i += chunkSize) {
        displayText = answer.slice(0, i + chunkSize);
    botContentDiv.innerHTML = converter.makeHtml(displayText);
    chatLog.scrollTop = chatLog.scrollHeight;
                    await new Promise(r => setTimeout(r, 50)); // Small delay for streaming effect
                }

    // Final update with complete text
    botContentDiv.innerHTML = converter.makeHtml(answer);

            } catch (error) {
        console.error("Error sending message:", error);

    // Handle automatic retry for 503 errors
    if (error.message.includes('API Error: 503') && retryCount < maxRetries) {
        retryCount++;
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s

    botContentDiv.innerHTML = `
    <div style="color: #f59e0b; margin-bottom: 12px;">
        <i class="fas fa-exclamation-triangle"></i> <strong>Service Temporarily Unavailable</strong>
    </div>
    <div style="color: #64748b; font-size: 0.9em; line-height: 1.4; margin-bottom: 12px;">
        Google AI servers are currently overloaded. Automatically retrying in ${delay / 1000} seconds...
    </div>
    <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
    `;
                    
                    setTimeout(() => {
        sendMessage(true); // Retry with same question
                    }, delay);
    return;
                }

    // Reset retry count after max retries or non-retryable errors
    retryCount = 0;

    let errorMessage = '';
    let errorDetails = '';

    if (error.message.includes('API Error: 503')) {
        errorMessage = 'Service Temporarily Unavailable';
    errorDetails = 'Google AI servers are currently overloaded. We tried multiple times but the service is still unavailable. Please try again later.';
                } else if (error.message.includes('API Error: 400')) {
        errorMessage = 'Invalid Request';
    errorDetails = 'There might be an issue with your API key or the request format. Please check your API key.';
                } else if (error.message.includes('API Error: 401')) {
        errorMessage = 'Authentication Failed';
    errorDetails = 'Your API key is invalid. Please check and update your API key.';
                } else if (error.message.includes('API Error: 429')) {
        errorMessage = 'Rate Limit Exceeded';
    errorDetails = 'You have made too many requests. Please wait a moment before trying again.';
                } else if (error.message.includes('API Error')) {
        errorMessage = 'API Error';
    errorDetails = error.message.replace('API Error: ', '');
                } else {
        errorMessage = 'Connection Error';
    errorDetails = 'Unable to connect to the AI service. Please check your internet connection and try again.';
                }

    botContentDiv.innerHTML = `
    <div style="color: #ef4444; margin-bottom: 12px;">
        <i class="fas fa-exclamation-triangle"></i> <strong>${errorMessage}</strong>
    </div>
    <div style="color: #64748b; font-size: 0.9em; line-height: 1.4;">
        ${errorDetails}
    </div>
    <div style="margin-top: 12px;">
        <button onclick="sendMessage()" style="
                            background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 0.85em;
                            transition: all 0.2s;
                        " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
            <i class="fas fa-redo"></i> Try Again
        </button>
    </div>
    `;
            } finally {
        isWaitingForResponse = false;
    sendButton.disabled = false;
    chatLog.scrollTop = chatLog.scrollHeight;
            }
        }

    function appendMessage(sender, text, type) {
            const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    avatarDiv.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    if (type === 'user') {
        contentDiv.textContent = text;
            } else {
        contentDiv.innerHTML = '';
            }

    bubbleDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(bubbleDiv);
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    return messageDiv;
        }

    sendButton.addEventListener("click", sendMessage);
        userInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
        event.preventDefault();
    sendMessage();
            }
        });

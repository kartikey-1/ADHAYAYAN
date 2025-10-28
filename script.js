document.addEventListener('DOMContentLoaded', function() {
  // Navigation and Page Switching
  const navLinks = document.querySelectorAll('nav a, .mobile-nav a, .feature-link, .subject-card');
  const pages = document.querySelectorAll('.page');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  const mobileSignupBtn = document.getElementById('mobileSignupBtn');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const tryChatbotBtn = document.getElementById('tryChatbotBtn');
  const ctaSignupBtn = document.getElementById('ctaSignupBtn');
  const ctaChatbotBtn = document.getElementById('ctaChatbotBtn');
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const closeBtns = document.querySelectorAll('.close');
  const sendMessageBtn = document.getElementById('sendMessage');
  const userInput = document.getElementById('userInput');
  const chatMessages = document.getElementById('chatMessages');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const semesterTabs = document.querySelectorAll('.semester-tab');
  
  // Handle page navigation
  function navigateToPage(sectionId) {
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(sectionId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Close mobile menu if open
    mobileNav.classList.remove('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
  }


  // Set up navigation link click handlers
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.hasAttribute('data-section')) {
        // Prevent default for links intended for in-page navigation
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        navigateToPage(sectionId);

        // Update URL with hash
        window.history.pushState(null, null, `#${sectionId}`);
      }
      // If the link doesn't have data-section, let the default browser navigation happen
    });
  });
  
  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', function() {
    mobileNav.classList.toggle('active');
  });
  
  // Modal handlers
  function openModal(modal) {
    modal.classList.add('active');
  }
  
  function closeModal(modal) {
    modal.classList.remove('active');
  }
  
  // Login/Signup button handlers
  loginBtn.addEventListener('click', () => openModal(loginModal));
  signupBtn.addEventListener('click', () => openModal(signupModal));
  mobileLoginBtn.addEventListener('click', () => openModal(loginModal));
  mobileSignupBtn.addEventListener('click', () => openModal(signupModal));
  getStartedBtn.addEventListener('click', () => openModal(signupModal));
  ctaSignupBtn.addEventListener('click', () => openModal(signupModal));
  
  // Try Chatbot button handlers
  tryChatbotBtn.addEventListener('click', function() {
    navigateToPage('chatbot');
    window.history.pushState(null, null, '#chatbot');
  });
  
  ctaChatbotBtn.addEventListener('click', function() {
    navigateToPage('chatbot');
    window.history.pushState(null, null, '#chatbot');
  });
  
  // Close modal buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });
  
  // Initialize page based on URL hash
  function initPageFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      navigateToPage(hash);
    }
  }
  
  // Call on page load and when hash changes
  initPageFromHash();
  window.addEventListener('hashchange', initPageFromHash);
  
  // Chatbot functionality
  if (sendMessageBtn && userInput && chatMessages) {
    // Handle sending messages
    function sendMessage() {
      const message = userInput.value.trim();
      if (message !== '') {
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Simulate bot response after delay
        setTimeout(() => {
          const botResponse = getBotResponse(message);
          addMessage(botResponse, 'bot');
        }, 1000);
      }
    }
    
    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      
      if (sender === 'user') {
        messageDiv.classList.add('user-message');
        messageDiv.innerHTML = `
          <div class="message-content">
            <p>${text}</p>
          </div>
          <div class="avatar">
            <i class="fas fa-user"></i>
          </div>
        `;
      } else {
        messageDiv.classList.add('bot-message');
        messageDiv.innerHTML = `
          <div class="avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <p>${text}</p>
          </div>
        `;
      }
      
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getBotResponse(message) {
      // Simple response logic (can be expanded)
      message = message.toLowerCase();
      
      if (message.includes('hello') || message.includes('hi')) {
        return "Hello! How can I assist you with your studies today?";
      } else if (message.includes('data structure')) {
        return "Data structures are specialized formats for organizing and storing data. Start with arrays and linked lists, then move on to trees, graphs, and hash tables.";
      } else if (message.includes('neural network')) {
        return "Neural networks are computational models inspired by the human brain. They consist of nodes (neurons) arranged in layers that process information and learn patterns from data.";
      } else if (message.includes('exam') || message.includes('test')) {
        return "For effective exam preparation: 1) Create a study schedule, 2) Use active recall techniques, 3) Take practice tests, 4) Get enough sleep before the exam, and 5) Review material regularly.";
      } else if (message.includes('calculus')) {
        return "Calculus can be challenging! Start with mastering limits and derivatives. Practice lots of problems and visualize concepts whenever possible. Would you like resources for specific calculus topics?";
      } else {
        return "That's an interesting question! I'm still learning how to answer queries like this. Could you try rephrasing or ask something about study techniques, programming, or core computer science subjects?";
      }
    }
    
    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Handle suggestion chips
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', function() {
        userInput.value = this.textContent;
        sendMessage();
      });
    });
  }
  
  // Filter buttons functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter logic for resources
      if (filter === 'all') {
        // Show all resources
        document.querySelectorAll('.resource-card, .resume-template').forEach(item => {
          item.style.display = 'block';
        });
      } else {
        // Filter by type
        document.querySelectorAll('.resource-card, .resume-template').forEach(item => {
          if (item.getAttribute('data-type') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });
  
  // Semester tabs functionality
  semesterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const semNumber = this.getAttribute('data-sem');
      
      // Update active tab
      semesterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding content
      document.querySelectorAll('.semester-content').forEach(content => {
        if (content.getAttribute('data-sem') === semNumber) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
  
  // Form submission handlers (prevent default for demo)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // For real implementation, form data would be processed here
      alert('This is a demo. In a real application, this form would submit data to a server.');
    });
  });
});

// for resume pdf download 
document.addEventListener('DOMContentLoaded', function() {
  const downloadButtons = document.querySelectorAll('.resume-template .template-actions .btn-primary');

  downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
      const pdfUrl = this.getAttribute('data-pdf-url');
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'resume_template.pdf';

        link.onload = function() {
          console.log('Download initiated for:', pdfUrl);
          document.body.removeChild(link);
        };

        link.onerror = function() {
          console.error('Error loading or downloading PDF from:', pdfUrl);
          alert('Error: Could not load or download the PDF file.');
          document.body.removeChild(link);
        };

        document.body.appendChild(link);
        link.click();
      } else {
        console.error('PDF URL not found in data-pdf-url attribute.');
        alert('Error: PDF download link is missing.');
      }
    });
  });
});
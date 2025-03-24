
// Simple router for handling navigation
const Router = (function() {
  // Routes configuration
  const routes = {
    '/': { 
      page: 'home',
      title: 'MathQuest - Learn Math with Fun'
    },
    '/quiz': { 
      page: 'quiz',
      title: 'Play Quiz - MathQuest'
    },
    '/leaderboard': { 
      page: 'leaderboard',
      title: 'Leaderboard - MathQuest'
    },
    '/admin': { 
      page: 'admin',
      title: 'Admin Panel - MathQuest',
      requiresAdmin: true
    }
  };
  
  // Current route
  let currentRoute = '/';
  
  // Navigation handler
  const navigate = (path, params = {}) => {
    // Check if the path exists in routes
    let route = routes[path];
    
    // If the route doesn't exist, use 404
    if (!route) {
      route = {
        page: '404',
        title: 'Page Not Found - MathQuest'
      };
      path = '/404';
    }
    
    // Check if the route requires admin
    if (route.requiresAdmin && !State.getIsAdmin()) {
      // Redirect to home if not admin
      navigate('/');
      Toast.error('Access Denied', 'You need admin permission to access this page.');
      return;
    }
    
    // Update browser history
    window.history.pushState({ path, params }, route.title, path);
    
    // Update document title
    document.title = route.title;
    
    // Store current route
    currentRoute = path;
    
    // Load the page
    loadPage(route.page, params);
  };
  
  // Load a page
  const loadPage = (page, params = {}) => {
    // Get the content container
    const contentElement = document.getElementById('app-content');
    
    // Clear existing content
    contentElement.innerHTML = '';
    
    // Add class to body indicating current page
    document.body.className = '';
    document.body.classList.add(`page-${page}`);
    
    // Update header active state
    updateHeaderActiveState(currentRoute);
    
    // Load the page based on the route
    switch (page) {
      case 'home':
        HomePage.render(contentElement);
        break;
      case 'quiz':
        QuizPage.render(contentElement, params);
        break;
      case 'leaderboard':
        LeaderboardPage.render(contentElement);
        break;
      case 'admin':
        AdminPage.render(contentElement);
        break;
      case '404':
        render404(contentElement);
        break;
      default:
        render404(contentElement);
    }
  };
  
  // Update header active state
  const updateHeaderActiveState = (path) => {
    // Find all nav links
    const navLinks = document.querySelectorAll('#app-header nav a');
    
    // Remove active class from all links
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      // Add active class if the href matches the current path
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
      }
    });
  };
  
  // Render 404 page
  const render404 = (container) => {
    container.innerHTML = `
      <div class="not-found">
        <h1>404</h1>
        <p>Oops! Page not found</p>
        <button class="btn btn-primary" onclick="Router.navigate('/')">Return to Home</button>
      </div>
    `;
  };
  
  // Handle browser back/forward
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.path) {
      navigate(event.state.path, event.state.params || {});
    } else {
      navigate('/');
    }
  });
  
  // Initialize
  const init = () => {
    // Get current path
    const path = window.location.pathname;
    
    // Navigate to the current path
    navigate(path);
    
    // Add event listener for link clicks
    document.addEventListener('click', (event) => {
      // Check if the click was on a link
      const link = event.target.closest('a');
      
      if (link && link.getAttribute('href').startsWith('/')) {
        // Prevent default link behavior
        event.preventDefault();
        
        // Navigate to the link
        navigate(link.getAttribute('href'));
      }
    });
  };
  
  // Public API
  return {
    navigate,
    init
  };
})();

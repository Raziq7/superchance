// Import electron-store if you want persistent storage
// import Store from 'electron-store';
// const store = new Store();

const TokenManager = {
    // Storage keys
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    TOKEN_EXPIRY: 'tokenExpiry',
  
    // Set authentication tokens
    setAuthTokens: (response) => {
      try {
        // Set tokens in localStorage
        localStorage.setItem(TokenManager.ACCESS_TOKEN, response.accessToken);
        localStorage.setItem(TokenManager.REFRESH_TOKEN, response.refreshToken);
        localStorage.setItem(TokenManager.TOKEN_EXPIRY, response.expiry);
  
        // Verify tokens were set
        const accessToken = localStorage.getItem(TokenManager.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(TokenManager.REFRESH_TOKEN);
        
        if (!accessToken || !refreshToken) {
          console.error('Failed to set tokens');
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Error setting tokens:', error);
        return false;
      }
    },
  
    // Get tokens
    getAccessToken: () => localStorage.getItem(TokenManager.ACCESS_TOKEN),
    getRefreshToken: () => localStorage.getItem(TokenManager.REFRESH_TOKEN),
    getTokenExpiry: () => localStorage.getItem(TokenManager.TOKEN_EXPIRY),
  
    // Clear all auth tokens
    clearTokens: () => {
      localStorage.removeItem(TokenManager.ACCESS_TOKEN);
      localStorage.removeItem(TokenManager.REFRESH_TOKEN);
      localStorage.removeItem(TokenManager.TOKEN_EXPIRY);
    },
  
    // Check if user is authenticated
    isAuthenticated: () => {
      const accessToken = TokenManager.getAccessToken();
      const expiry = TokenManager.getTokenExpiry();
      
      if (!accessToken || !expiry) return false;
      
      return new Date(expiry) > new Date();
    }
  };

export default TokenManager;
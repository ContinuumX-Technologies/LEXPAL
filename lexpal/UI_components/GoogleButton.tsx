export default function GoogleButton() {
  return (
    <button
      className="googleSocialBtn"
      data-ms-auth-provider="google"
      data-ms-auth-connected-text="Disconnect from Google"
    >
      <span className="googleLogoWrapper">
        <svg
          className="googleLogo"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="#EA4335" d="M12 10.2v3.6h5.09c-.22 1.17-.89 2.16-1.9 2.83l3.07 2.39C20.35 16.98 21.5 14.66 21.5 12c0-.7-.06-1.37-.17-2H12z"></path>
          <path fill="#34A853" d="M12 21c2.7 0 4.96-.9 6.61-2.41l-3.07-2.39c-.85.57-1.94.91-3.54.91-2.72 0-5.03-1.83-5.85-4.29H3.04v2.69A9 9 0 0012 21z"></path>
          <path fill="#4285F4" d="M6.15 12c0-.48.08-.94.21-1.38V7.93H3.04A8.98 8.98 0 003 12c0 1.47.35 2.86.96 4.07l3.12-2.42A5.41 5.41 0 016.15 12z"></path>
          <path fill="#FBBC05" d="M12 6.58c1.47 0 2.78.51 3.82 1.51l2.86-2.86C17 3.95 14.7 3 12 3 8.04 3 4.64 5.19 3 8.27l3.36 2.61c.82-2.46 3.13-4.29 5.64-4.29z"></path>
        </svg>
      </span>

      <span className="text">Continue with Google</span>
    </button>
  );
}
//styled in app/globals.css
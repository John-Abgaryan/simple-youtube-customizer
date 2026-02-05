// Function to calculate if a color is light or dark
function getContrastColor(hexcolor) {
  // If no color, default to white text
  if (!hexcolor) return '#ffffff';
  
  // Remove # if present
  const hex = hexcolor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return (luminance > 0.5) ? '#0f0f0f' : '#ffffff';
}

// Function to apply styles
function applyStyles(settings) {
  let styleElem = document.getElementById('yt-customizer-style');
  if (!styleElem) {
    styleElem = document.createElement('style');
    styleElem.id = 'yt-customizer-style';
    document.documentElement.appendChild(styleElem);
  }

  const textColor = getContrastColor(settings.bgColor);
  const headerTextColor = getContrastColor(settings.headerColor);
  const duration = settings.enableTransition ? '0.5s' : '0s';

  const css = `
    /* Smooth Transitions for all color changes */
    html, body, ytd-app, #masthead-container, ytd-feed-filter-chip-bar-renderer, #chips-wrapper,
    yt-formatted-string, span, div, a, yt-icon, .yt-spec-icon-shape, button, input {
        transition-property: background-color, color, fill, border-color !important;
        transition-duration: ${duration} !important;
        transition-timing-function: ease !important;
    }

    /* Background theme */
    html,
    body,
    ytd-app,
    ytd-watch-flexy,
    ytd-browse,
    ytd-search,
    #content,
    #container,
    #primary,
    #secondary,
    ytd-rich-grid-renderer,
    ytd-guide-renderer,
    ytd-comments,
    ytd-item-section-renderer,
    ytd-playlist-panel-renderer {
        background-color: ${settings.bgColor} !important;
    }

    /* Text Colors based on background contrast */
    yt-formatted-string,
    #video-title,
    #content-text,
    #channel-name,
    #title.ytd-shelf-renderer,
    #title.ytd-rich-shelf-renderer,
    .title.ytd-guide-entry-renderer,
    #guide-section-title.ytd-guide-section-renderer,
    #label.ytd-compact-link-renderer,
    #main-link.ytd-rich-grid-media,
    #video-title.ytd-rich-grid-media,
    #video-title.ytd-video-renderer,
    .yt-core-attributed-string,
    .yt-core-attributed-string--link-inherit-color,
    #description-text,
    #description-inline-expander,
    #description-inline-expander .yt-core-attributed-string,
    yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string,
    #author-text.style-scope,
    ytd-comment-view-model #author-text,
    #vote-count-middle.ytd-comment-engagement-bar {
        color: ${textColor} !important;
    }

    /* Meta text (views, dates) - slightly transparent version of text color */
    #metadata-line span,
    #byline-container,
    .ytd-video-meta-block {
        color: ${textColor} !important;
        opacity: 0.7 !important;
    }

    /* Icons color */
    yt-icon,
    .yt-spec-icon-shape,
    .yt-spec-icon-shape div,
    #like-button yt-icon,
    #dislike-button yt-icon,
    .yt-spec-touch-feedback-shape__fill {
        fill: ${textColor} !important;
        color: ${textColor} !important;
    }

    /* Masthead specific icon overrides to use header text color */
    ytd-masthead yt-icon,
    ytd-masthead .yt-spec-icon-shape,
    ytd-masthead .yt-spec-icon-shape div,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal yt-icon,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled yt-icon,
    #voice-search-button yt-icon,
    #buttons yt-icon {
        color: ${headerTextColor} !important;
        fill: ${headerTextColor} !important;
    }

    /* Chips/Filter Bar */
    ytd-feed-filter-chip-bar-renderer,
    #chips-wrapper {
        background-color: ${settings.chipColor || settings.bgColor} !important;
    }

    .ytChipShapeInactive,
    yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"] #chip-container,
    yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"] #chip-container,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text,
    #description.ytd-watch-metadata,
    ytd-watch-metadata[description-collapsed] #description.ytd-watch-metadata:hover,
    #voice-search-button .yt-spec-button-shape-next,
    #buttons .yt-spec-button-shape-next,
    ytd-tabbed-page-header,
    #page-header.ytd-tabbed-page-header,
    #page-header-container.ytd-tabbed-page-header,
    #tabs-container.ytd-tabbed-page-header {
        background-color: ${settings.headerColor} !important;
        color: ${headerTextColor} !important;
    }

    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal yt-icon,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal .yt-spec-button-shape-next__button-text-content,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled yt-icon,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled .yt-spec-button-shape-next__button-text-content,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text yt-icon,
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text .yt-spec-button-shape-next__button-text-content,
    #voice-search-button yt-icon,
    #buttons yt-icon {
        color: ${headerTextColor} !important;
        fill: ${headerTextColor} !important;
    }

    .ytChipShapeActive,
    yt-chip-cloud-chip-renderer[chip-style="STYLE_DEFAULT"][selected] #chip-container,
    yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"][selected] #chip-container {
        background-color: ${textColor} !important;
        color: ${settings.bgColor} !important;
    }

    /* Masthead/Header color */
    ytd-masthead,
    #masthead-container,
    #container.ytd-masthead {
        background-color: ${settings.headerColor} !important;
        background: ${settings.headerColor} !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: none !important;
    }

    /* Header Icons and search */
    ytd-masthead yt-icon,
    ytd-masthead .yt-spec-icon-shape,
    ytd-masthead #container.ytd-searchbox input,
    ytd-masthead #container.ytd-searchbox {
        color: ${headerTextColor} !important;
        fill: ${headerTextColor} !important;
    }

    #search-icon-legacy.ytd-searchbox {
        background-color: transparent !important;
        border: 1px solid ${headerTextColor} !important;
        opacity: 0.6 !important;
    }

    #search-icon-legacy.ytd-searchbox yt-icon {
        color: ${headerTextColor} !important;
    }

    /* Hide the native SVG Logo */
    ytd-topbar-logo-renderer yt-icon#logo-icon svg {
        display: ${settings.logoDataUrl ? 'none' : 'block'} !important;
    }

    /* Custom logo */
    ytd-topbar-logo-renderer yt-icon#logo-icon {
        width: ${settings.logoDataUrl ? '108px' : 'auto'} !important;
        height: ${settings.logoDataUrl ? '24px' : 'auto'} !important;
        margin-left: ${settings.logoDataUrl ? '12px' : '0'} !important;
        background-image: ${settings.logoDataUrl ? `url("${settings.logoDataUrl}")` : 'none'};
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
    }

    /* Remove "Play on TV / Cast" button */
    .ytp-remote-button {
        display: none !important;
    }

    /* Scrollbar for the sidebar */
    #guide-inner-content,
    #guide-content,
    ytd-guide-renderer,
    #sections.ytd-guide-renderer {
        scrollbar-width: thin !important;
        scrollbar-color: ${settings.headerColor} transparent !important;
    }

    #guide-inner-content::-webkit-scrollbar,
    #guide-content::-webkit-scrollbar,
    ytd-guide-renderer::-webkit-scrollbar,
    #sections.ytd-guide-renderer::-webkit-scrollbar {
        width: 8px !important;
    }

    #guide-inner-content::-webkit-scrollbar-track,
    #guide-content::-webkit-scrollbar-track,
    ytd-guide-renderer::-webkit-scrollbar-track,
    #sections.ytd-guide-renderer::-webkit-scrollbar-track {
        background: transparent !important;
    }

    #guide-inner-content::-webkit-scrollbar-thumb,
    #guide-content::-webkit-scrollbar-thumb,
    ytd-guide-renderer::-webkit-scrollbar-thumb,
    #sections.ytd-guide-renderer::-webkit-scrollbar-thumb {
        background: ${settings.headerColor} !important;
        border-radius: 4px !important;
    }
  `;

  styleElem.textContent = css;
}

// Initial Load
const DEFAULT_SETTINGS = {
  bgColor: '#161b22',
  headerColor: '#11141a',
  chipColor: '#161b22',
  logoDataUrl: ''
};

chrome.storage.local.get(['ytSettings'], (result) => {
  const settings = result.ytSettings || DEFAULT_SETTINGS;
  applyStyles(settings);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStyles') {
    applyStyles(request.settings);
  }
});

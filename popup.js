document.addEventListener('DOMContentLoaded', () => {
  const mainColorInput = document.getElementById('mainColor');
  const bgColorInput = document.getElementById('bgColor');
  const headerColorInput = document.getElementById('headerColor');
  const chipColorInput = document.getElementById('chipColor');
  const advancedToggle = document.getElementById('advancedToggle');
  const advancedSettings = document.getElementById('advancedSettings');
  const logoUrlInput = document.getElementById('logoUrl');
  const logoUploadCallback = document.getElementById('logoUpload');
  const logoPreview = document.getElementById('logoPreview');
  const previewContainer = document.getElementById('previewContainer');
  const removeLogoBtn = document.getElementById('removeLogoBtn');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const themeToggle = document.getElementById('themeToggle');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  // Defaults
  const DEFAULT_SETTINGS = {
    mainColor: '#161b22',
    bgColor: '#161b22',
    headerColor: '#11141a',
    chipColor: '#161b22',
    logoDataUrl: '',
    appTheme: 'dark'
  };

  // Helper to darken a hex color
  function darkenColor(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.max(0, Math.floor(r * (1 - amount)));
    g = Math.max(0, Math.floor(g * (1 - amount)));
    b = Math.max(0, Math.floor(b * (1 - amount)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // App Theme Toggle
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    const theme = isLight ? 'light' : 'dark';
    sunIcon.style.display = isLight ? 'block' : 'none';
    moonIcon.style.display = isLight ? 'none' : 'block';

    // Apply Theme Colors
    if (isLight) {
      mainColorInput.value = '#fffaf0';
      bgColorInput.value = '#fffaf0';
      headerColorInput.value = '#e8dec8';
      chipColorInput.value = '#fffaf0';
    } else {
      mainColorInput.value = '#161b22';
      bgColorInput.value = '#161b22';
      headerColorInput.value = '#0d1117';
      chipColorInput.value = '#161b22';
    }

    updatePreview(getCurrentSettings(), true);
    
    chrome.storage.local.get(['ytSettings'], (result) => {
      const settings = result.ytSettings || DEFAULT_SETTINGS;
      settings.appTheme = theme;
      chrome.storage.local.set({ ytSettings: settings });
    });
  });

  // Randomize Colors
  randomizeBtn.addEventListener('click', () => {
    const isLightMode = document.body.classList.contains('light-mode');
    
    // Helper for themed random hex
    const getRandomThemedHex = (isLight) => {
      // For Dark: 0-128 range (00-80 hex)
      // For Light: 180-255 range (B4-FF hex)
      const min = isLight ? 180 : 20;
      const max = isLight ? 255 : 120;
      
      const r = Math.floor(Math.random() * (max - min) + min);
      const g = Math.floor(Math.random() * (max - min) + min);
      const b = Math.floor(Math.random() * (max - min) + min);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const newBase = getRandomThemedHex(isLightMode);
    const newHeader = darkenColor(newBase, 0.4);
    
    mainColorInput.value = newBase;
    bgColorInput.value = newBase;
    chipColorInput.value = newBase;
    headerColorInput.value = newHeader;
    
    updatePreview(getCurrentSettings(), true);
  });

  // Helper to send updates to the active tab
  function updatePreview(settings, enableTransition = false) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'updateStyles', 
          settings: { ...settings, enableTransition }
        });
      }
    });
  }

  // Get current state from inputs
  function getCurrentSettings() {
    const logoSrc = (logoPreview.src && logoPreview.src !== window.location.href) ? logoPreview.src : '';
    return {
      mainColor: mainColorInput.value,
      bgColor: bgColorInput.value,
      headerColor: headerColorInput.value,
      chipColor: chipColorInput.value,
      logoDataUrl: logoSrc
    };
  }

  // Main color sync listener
  mainColorInput.addEventListener('input', () => {
    const base = mainColorInput.value;
    const darker = darkenColor(base, 0.4); // Made it 40% darker for better contrast
    
    bgColorInput.value = base;
    headerColorInput.value = darker;
    chipColorInput.value = base;
    
    // Broadcast update
    const currentSettings = getCurrentSettings();
    updatePreview(currentSettings, false); // No transition on drag
  });

  // Advanced color listeners
  bgColorInput.addEventListener('input', () => updatePreview(getCurrentSettings(), false));
  headerColorInput.addEventListener('input', () => updatePreview(getCurrentSettings(), false));
  chipColorInput.addEventListener('input', () => updatePreview(getCurrentSettings(), false));

  // Toggle Advanced Settings
  advancedToggle.addEventListener('click', () => {
    const isHidden = advancedSettings.style.display === 'none' || !advancedSettings.style.display;
    advancedSettings.style.display = isHidden ? 'block' : 'none';
    advancedToggle.textContent = isHidden ? 'Hide Advanced Settings' : 'Advanced Color Settings';
  });

  // Logo URL listener
  logoUrlInput.addEventListener('input', () => {
    const url = logoUrlInput.value.trim();
    if (url) {
      logoPreview.src = url;
      logoPreview.style.display = 'block';
      previewContainer.style.display = 'block';
    } else {
      logoPreview.style.display = 'none';
      previewContainer.style.display = 'none';
      logoPreview.removeAttribute('src');
    }
    updatePreview(getCurrentSettings(), false);
  });

  // Load saved settings
  chrome.storage.local.get(['ytSettings'], (result) => {
    const settings = result.ytSettings || DEFAULT_SETTINGS;
    mainColorInput.value = settings.mainColor || settings.bgColor;
    bgColorInput.value = settings.bgColor;
    headerColorInput.value = settings.headerColor;
    chipColorInput.value = settings.chipColor || settings.bgColor;

    // Apply saved app theme
    if (settings.appTheme === 'light') {
      document.body.classList.add('light-mode');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
    
    if (settings.logoDataUrl) {
      logoPreview.src = settings.logoDataUrl;
      logoPreview.style.display = 'block';
      previewContainer.style.display = 'block';
      if (!settings.logoDataUrl.startsWith('data:')) {
        logoUrlInput.value = settings.logoDataUrl;
      }
    }
  });

  // Handle Remove Logo
  removeLogoBtn.addEventListener('click', () => {
    logoPreview.src = '';
    logoPreview.style.display = 'none';
    previewContainer.style.display = 'none';
    logoUrlInput.value = '';
    logoUploadCallback.value = '';
    updatePreview(getCurrentSettings(), false);
  });

  // Handle Image Upload
  logoUploadCallback.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        logoPreview.src = event.target.result;
        logoPreview.style.display = 'block';
        previewContainer.style.display = 'block';
        logoUrlInput.value = '';
        updatePreview(getCurrentSettings(), false); // Image upload is instant? Maybe true? Let's keep it false/instant.
      };
      reader.readAsDataURL(file);
    }
  });

  // Save Settings
  saveBtn.addEventListener('click', () => {
    const settings = getCurrentSettings();
    chrome.storage.local.set({ ytSettings: settings }, () => {
      updatePreview(settings, true); // Maybe transition on save?
      const originalText = saveBtn.textContent;
      saveBtn.textContent = 'Saved!';
      setTimeout(() => saveBtn.textContent = originalText, 1500);
    });
  });

  // Reset Settings
  resetBtn.addEventListener('click', () => {
    mainColorInput.value = DEFAULT_SETTINGS.mainColor;
    bgColorInput.value = DEFAULT_SETTINGS.bgColor;
    headerColorInput.value = DEFAULT_SETTINGS.headerColor;
    chipColorInput.value = DEFAULT_SETTINGS.chipColor;
    logoPreview.style.display = 'none';
    previewContainer.style.display = 'none';
    logoPreview.removeAttribute('src');
    logoUrlInput.value = ''; 
    logoUploadCallback.value = '';
    saveBtn.click();
  });
});
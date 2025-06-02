
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1a8ded759e394e66af7a93bafa3151a8',
  appName: 'daily-sync-android-agenda',
  webDir: 'dist',
  server: {
    url: 'https://1a8ded75-9e39-4e66-af7a-93bafa3151a8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    }
  }
};

export default config;

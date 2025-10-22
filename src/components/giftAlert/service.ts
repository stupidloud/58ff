import { createApp, reactive } from 'vue';
import GiftAlert from './GiftAlert.vue';

let mounted = false;
const state = reactive({ visible: false });

export function mountGiftAlert() {
  if (mounted) return;
  const container = document.createElement('div');
  container.id = 'gift-alert-app';
  document.body.appendChild(container);

  const app = createApp(GiftAlert);
  app.provide('giftAlertState', state);
  app.mount(container);
  mounted = true;
}

export function showGiftAlert() {
  state.visible = true;
}

export function hideGiftAlert() {
  state.visible = false;
}
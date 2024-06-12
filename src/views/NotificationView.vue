<template>
    <div class="container">
        <h2>Test des notifications</h2>
        <button type="button" id="send">Send notification</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async () => {
    const sendButton = document.querySelector('#send');

    if (sendButton) {
        const registration = await navigator.serviceWorker.getRegistration();

        const sendNotification = async () => {
            if (Notification.permission === 'granted') {
                showNotification('Coucou');
            } else {
                if (Notification.permission !== 'denied') {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        showNotification('Coucou');
                    }
                }
            }
        };

        const showNotification = (body: string) => {
            const title = 'Notification';
            const payload = { body };

            if (registration && 'showNotification' in registration) {
                registration.showNotification(title, payload);
            } else {
                new Notification(title, payload);
            }
        };

        sendButton.addEventListener('click', sendNotification);
    } else {
        console.error('Button not found');
    }
});
</script>

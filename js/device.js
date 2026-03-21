async function getDeviceFingerprint() {
    const components = {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        canvas: (() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Updated text for Jengu branding in canvas hash
            ctx.fillText('Jengu_System_Fingerprint', 2, 10); 
            return canvas.toDataURL();
        })()
    };

    let uuid = localStorage.getItem('jengu_device_uuid');
    if (!uuid) {
        uuid = crypto.randomUUID();
        localStorage.setItem('jengu_device_uuid', uuid);
    }
    components.uuid = uuid;

    const stringToHash = JSON.stringify(components);
    const msgBuffer = new TextEncoder().encode(stringToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
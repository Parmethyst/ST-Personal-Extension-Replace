import { extension_settings, loadExtensionSettings } from '../../../extensions.js';
import { chat, saveChat } from '../../../../script.js';

const extensionName = "ST-Personal-Extension-Replace";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;


jQuery(async () => {
    if ($("#my-extension-panel").length > 0) return;
    // This is an example of loading HTML from a file
    const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);

    $('#extensions_settings').append(settingsHtml);

    $('#st-fr-execute').on('click', () => {
        const target = $('#st-fr-target').val();
        const replacement = $('#st-fr-replacement').val();

        if (!target) {
            toastr.error('Please enter text to find.', 'Find & Replace');
            return;
        }

        performFindAndReplace(target, replacement);
    });
});

async function performFindAndReplace(target, replacement) {
    if (!chat || chat.length === 0) {
        toastr.warning('No active chat found.', 'Find & Replace');
        return;
    }

    const lastIndex = chat.length - 1;
    const lastMessage = chat[lastIndex];

    if (!lastMessage || !lastMessage.mes) {
        toastr.warning('The last message is empty.', 'Find & Replace');
        return;
    }

    if (!lastMessage.mes.includes(target)) {
        toastr.info('Target string not found in the last message.', 'Find & Replace');
        return;
    }

    lastMessage.mes = lastMessage.mes.replaceAll(target, replacement);

    await saveChat();

    toastr.success('Last message updated successfully! Reloading view...', 'Find & Replace');
    
    // Refresh UI to display modification
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}
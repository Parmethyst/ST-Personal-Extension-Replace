import { extension_settings, loadExtensionSettings } from '../../../extensions.js';
import { chat, saveChat } from '../../../../script.js';

const extensionName = "ST-Personal-Extension-Replace";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;


jQuery(async () => {
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

    // 1. Update the chat data model
    lastMessage.mes = lastMessage.mes.replaceAll(target, replacement);

    // 2. Persist change to backend storage
    await saveChat();

    // 3. Update the DOM visually without reloading the page
    const $messageEl = $(`#chat .mes[mesid="${lastIndex}"]`);
    
    if ($messageEl.length) {
        const $mesText = $messageEl.find('.mes_text');
        
        // Update the text content directly 
        // Note: If your replacement text contains markdown, you may want to handle 
        // markdown compilation, but for text-to-text swaps, updating text() or html() works.
        $mesText.text(lastMessage.mes);
    }

    toastr.success('Last message updated successfully!', 'Find & Replace');
}
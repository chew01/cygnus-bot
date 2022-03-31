import { MessageActionRow, MessageButton } from 'discord.js';

function createGalleryRow(page: number, pageCount: number, end?: boolean): MessageActionRow {
  const prevBtn = new MessageButton()
    .setCustomId('prevbtn')
    .setLabel('Previous')
    .setEmoji('◀️')
    .setStyle('PRIMARY');
  const nextBtn = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('Next')
    .setEmoji('▶️')
    .setStyle('PRIMARY');
  const timeOut = new MessageButton()
    .setCustomId('timeout')
    .setLabel('Command timed out.')
    .setEmoji('🕓')
    .setStyle('SECONDARY')
    .setDisabled(true);
  if (end) {
    return new MessageActionRow()
      .addComponents(timeOut);
  }
  if (page === 0 && page === pageCount - 1) {
    return new MessageActionRow()
      .addComponents(prevBtn.setDisabled(true), nextBtn.setDisabled(true));
  }
  if (page === 0) {
    return new MessageActionRow()
      .addComponents(prevBtn.setDisabled(true), nextBtn);
  }
  if (page === pageCount - 1) {
    return new MessageActionRow()
      .addComponents(prevBtn, nextBtn.setDisabled(true));
  }
  return new MessageActionRow()
    .addComponents(prevBtn, nextBtn);
}

export default createGalleryRow;

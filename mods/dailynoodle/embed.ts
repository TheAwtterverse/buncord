import { EmbedBuilder, EmbedAuthorOptions } from 'discord.js';

export default (author: EmbedAuthorOptions | null, imageUrl: string, copyright: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setTitle('Daily Noodle')
        .setAuthor(author)
        .setTimestamp()
        .setImage(imageUrl)
        .setFooter({ text: `Image via ${copyright}` });
}
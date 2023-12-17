import { EmbedBuilder, User } from 'discord.js';

export default (me: User, imageUrl: string, copyright: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setTitle('Daily Noodle')
        .setAuthor({ name: me.username, iconURL: me.avatarURL() || undefined })
        .setTimestamp()
        .setImage(imageUrl)
        .setFooter({ text: `Image via ${copyright}` });
}
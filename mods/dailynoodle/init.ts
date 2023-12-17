import * as mongoose from 'mongoose';
import { Noodle, NoodleStash, Provider, GuildSetup } from './schemas';

export default async () => {

    await mongoose.connect('mongodb://127.0.0.1:27017/dailynoodle');

    ['Otter', 'Ferret', 'Marten', 'Badger'].map(async (name) => await Noodle.findOneAndUpdate({ name }, { name }, { upsert: true, runValidators: true }));

    await Provider.findOneAndUpdate({ name: 'TinyFox' }, {
        name: 'TinyFox',
        endpoint: 'https://api.tinyfox.dev',
        mapping: [
            {
                noodle: await Noodle.findOne({ name: 'Otter' }),
                query: '/img?animal=ott&json',
            },
            {
                noodle: await Noodle.findOne({ name: 'Ferret' }),
                query: '/img?animal=dook&json',
            },
            {
                noodle: await Noodle.findOne({ name: 'Marten' }),
                query: '/img?animal=marten&json',
            },
        ],
    }, { upsert: true, runValidators: true });
};
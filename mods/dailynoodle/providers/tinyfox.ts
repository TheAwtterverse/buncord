import Provider, { INoodleMapping } from './provider';

export default {
    name: 'TinyFox',
    generateUrl: async function (noodleName: string): Promise<{ imageUrl: string, copyright: string }> {

        const mapping = this.noodleMapping.find((n: INoodleMapping) => n.noodleName === noodleName);
        if (!mapping) throw new Error('Noodle not available.');

        const imageRes = await fetch(`https://api.tinyfox.dev${mapping.query}`);
        const image = await imageRes.json();
        if (!image.hasOwnProperty('loc')) {
            throw new Error('The "loc" attribute does not exist in the response');
        }

        return {
            imageUrl: `https://api.tinyfox.dev${image.loc}`,
            copyright: 'tinyfox.dev'
        }
    },
    noodleMapping: [
        {
            noodleName: 'Otter',
            query: '/img?animal=ott&json'
        },
        {
            noodleName: 'Ferret',
            query: '/img?animal=dook&json'
        },
        {
            noodleName: 'Marten',
            query: '/img?animal=marten&json'
        }
    ]
} as Provider;
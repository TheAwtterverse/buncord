export interface INoodleMapping {
    noodleName: string;
    query: string;
};

export default interface IProvider {
    name: string;
    noodleMapping: Array<INoodleMapping>;
    generateUrl: (noodleName: string) => Promise<{ imageUrl: string, copyright: string }>;
}
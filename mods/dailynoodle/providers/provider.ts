export interface NoodleMapping {
    noodleName: string;
    query: string;
};

export default interface Provider {
    name: string;
    noodleMapping: Array<NoodleMapping>;
    generateUrl: (noodleName: string) => Promise<{ imageUrl: string, copyright: string }>;
}
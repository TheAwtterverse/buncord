import * as mongoose from 'mongoose';

const noodleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    }
);
export type Noodle = mongoose.InferSchemaType<typeof noodleSchema>;
export const Noodle = mongoose.model('Noodle', noodleSchema);

const providerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        endpoint: { type: String, required: true },
        auth: { type: mongoose.Schema.Types.Mixed, required: false },
        mapping: [{ noodle: { type: mongoose.Schema.Types.ObjectId, ref: 'Noodle' }, query: { type: String, required: true } }],
        copyright: { type: String, required: false },
    },
    {
        methods: {
            generateUrl(noodle: Noodle & { _id: mongoose.Types.ObjectId }): string | null {
                const mappingItem = this.mapping.find(m => m.noodle && m.noodle.equals(noodle._id));
                if (mappingItem) {
                    return `${this.endpoint}${mappingItem.query}`;
                }
                return null;
            },
        },
    }
);
export type Provider = mongoose.InferSchemaType<typeof providerSchema>;
export const Provider = mongoose.model('Provider', providerSchema);

const noodleStashSchema = new mongoose.Schema(
    {
        noodle: { type: mongoose.Schema.Types.ObjectId, ref: 'Noodle', required: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
        imageUrl: { type: String, required: true },
    }
);
export type NoodleStash = mongoose.InferSchemaType<typeof noodleStashSchema>;
export const NoodleStash = mongoose.model('NoodleStash', noodleStashSchema);

const guildSetupSchema = new mongoose.Schema(
    {
        guild: { type: String, required: true },
        channel: { type: String, required: true },
        noodles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Noodle', required: true }],
    }
);
export type GuildSetup = mongoose.InferSchemaType<typeof guildSetupSchema>;
export const GuildSetup = mongoose.model('GuildSetup', guildSetupSchema);

const scheduledNoodleSchema = new mongoose.Schema(
    {
        guild: { type: String, required: true },
        channel: { type: String, required: true },
        noodle: { type: noodleSchema, required: true },
        hour: { type: Number, required: true }
    }
);
export type ScheduledNoodle = mongoose.InferSchemaType<typeof scheduledNoodleSchema>;
export const ScheduledNoodle = mongoose.model('ScheduledNoodle', scheduledNoodleSchema);
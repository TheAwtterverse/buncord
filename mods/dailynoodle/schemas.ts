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
        noodles: [{ type: noodleSchema, required: true }],
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
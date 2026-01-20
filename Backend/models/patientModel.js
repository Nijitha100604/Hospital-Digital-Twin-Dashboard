import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({

    patientId: { type: String, unique: true },
    personal:{
        name : { type: String, required: true },
        gender:{ type: String, required: true },
        age:{ type: Number, required: true },
        bloodGroup:{ type: String, required: true },
        email:{ type: String, unique: true, required: true },
        address:{ type:String, required: true },
        contact:{ type: String, required: true }
    },
    guardian:{
        name:{ type: String, default: "" },
        contact:{ type: String, default: "" }
    },
    medical:{
        allergies:{ type: [String], default: [] },
        history:{ type: [String], default: [] }
    },
    proof: { type: String, default : "" },
    vitals:[
        {
            name: {type: String, required: true},
            value : {type: mongoose.Schema.Types.Mixed, required: true},
            unit : {type: String, required: true},
            status : {type: String, required: true}
        }
    ]

}, { timestamps: true });

patientSchema.pre('save', async function() {
    if (!this.patientId) {
        const lastPatient = await mongoose.model('patient').findOne({}, {}, { sort: { 'createdAt': -1 } });
        
        let newSerialNumber = 1;
        if (lastPatient && lastPatient.patientId) {
            const lastIdNumber = parseInt(lastPatient.patientId.replace('PID', ''));
            newSerialNumber = lastIdNumber + 1;
        }
        this.patientId = `PID${newSerialNumber.toString().padStart(6, '0')}`;
    }
});

const patientModel = mongoose.models.patient || mongoose.model('patient', patientSchema);
export default patientModel;
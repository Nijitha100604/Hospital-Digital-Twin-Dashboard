import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({

    issueId: { type: String, unique: true },
    issueType : { type: String, required: true },
    priorityLevel : { type: String, required: true },
    location : { type: String, required: true },
    block : { type: String, required: true },
    description : { type: String, required: true },
    status : { type: String, required: true, default: "Pending" },
    reportedBy : { type: String, default: "" },
    reporterId : { type: String, default : "" },

}, {timestamps : true})

issueSchema.pre("save", async function () {
  if (!this.issueId) {
    const lastIssue = await mongoose.model("issue").findOne({}, {}, { sort: { createdAt: -1 } });

    let num = 1;
    if (lastIssue?.issueId) {
      num = parseInt(lastIssue.issueId.replace("ISS-", "")) + 1;
    }

    this.issueId = `ISS-${num.toString().padStart(5, "0")}`;
  }
});

const issueModel = mongoose.models.issue || mongoose.model('issue', issueSchema);
export default issueModel;
import { model, Schema } from "mongoose";
import { INotice, INoticeType } from "./notice.interfaces";


const noticeTypeSchema = new Schema<INoticeType>({
    name: { type: String, required: true, unique: true }
}, {
    timestamps: true,
    versionKey: false
})


export const NoticeType = model<INoticeType>("NoticeType", noticeTypeSchema)



const noticeSchema = new Schema<INotice>({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  date: { type: Date, required: true },
  description: { type: String },
  images: { type: [String], default: [] },
  noticeType: {
        type: Schema.Types.ObjectId,
        ref: "NoticeType",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false, 
});


noticeSchema.pre("save", async function(next){
  if(this.isModified("title")){
    const baseSlug = this.title.toLowerCase().split(" ").join("-")
    let slug= `${baseSlug}`

    let counter = 0;

    while (await Notice.exists({slug})){
      slug = `${slug}-${counter++}`
    }
    this.slug = slug;
  }
  next()
})

noticeSchema.pre("findOneAndUpdate", async function (next){
  const notice = this.getUpdate() as Partial<INotice>

  if(notice.title){
    const baseSlug = notice.title.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}`

    let counter = 0;

    while (await Notice.exists({ slug })){
      slug = `${slug}-${counter++}`
    }
    notice.slug = slug
  }
  this.setUpdate(notice)
  next()
})



export const Notice = model<INotice>('Notice', noticeSchema);
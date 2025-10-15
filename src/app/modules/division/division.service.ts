import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";



const createDivision = async (payload: IDivision) => {
   
    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new AppError(httpStatusCode.BAD_REQUEST, 
            'A division with this name already exists.',''
        );
    }

    // const baseSlug = payload.name.toLowerCase().split(' ').join('-');
    // let slug = `${baseSlug}-division`;
    // let counter = 0; 
    // while (await Division.exists({ slug})) {
    //     slug = `${slug}-${counter++}`;
    // }
    // payload.slug = slug;

    const division = await Division.create(payload)
    return division
}

const getAllDivision = async () => {   
    const division = await Division.find({});
    const countDivision = await Division.countDocuments();
    return {
        data: division,
        meta: {
            total: countDivision
        }
    }
}
const getSingleDivision = async (slug: string)=>{
    const division = await Division.findOne({slug});
   
    return {
        data: division,
    }
}

const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {
    // update logic will be implemented here
    const existingDivision = await Division.findById(divisionId);
    if (!existingDivision) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Division ID not found", "");
    }
    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
        throw new AppError(httpStatusCode.CONFLICT, "A division with this name already exists.", "");
    }

    // if(payload.name){
    //     const baseSlug = payload.name.toLowerCase().split(' ').join('-');
    //     let slug = `${baseSlug}-division`;
    //     let counter = 0; 
    //     while (await Division.exists({ slug})) {
    //         slug = `${slug}-${counter++}`;
    //     }
    //     payload.slug = slug;
    // }


    const updateDivision = await Division.findByIdAndUpdate(
        divisionId, payload, { new: true, runValidators: true }
    );
   
    return updateDivision;
    }


    const deleteDivision = async (divisionId: string) => {
        await Division.findByIdAndDelete(divisionId);   
        return null;
    }

export const DivisionService = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
}

// createDivision name function create korechi ja database ar sathe connect tai async use kora hoyeche, karon database theke data fetch korte somoy lage tai async await use kora hoyeche. 
// payload er moddhe Partial<IDivision> use kora hoyeche karon amra payload er maje sob data pabo are na. tai Partial use kora hoyeche. sathe type IDivision use kora hoyeche karon amra Division interface theke data nibo.
// payload theke name, slug, thumbnail, description ke destructure kora hoyeche.
// slug jodi na thake tahole name theke slug generate kora hoyeche. slug generate korar jonno name ke trim kore lower case e convert kora hoyeche. r jodi slug thake tahole seta ke trim kore lower case e convert kora hoyeche.
// name and slug er uniqueness check kora hoyeche. jodi name or slug already thake tahole error throw kora hoyeche.
// Division model theke findOne method use kore name and slug er uniqueness check kora hoyeche.
// jodi name and slug unique hoy tahole notun division create kora hoyeche. Division model theke create method use kore notun division create kora hoyeche.
// create method er moddhe name, slug, thumbnail, description pass kora hoyeche.

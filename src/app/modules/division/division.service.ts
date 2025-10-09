import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";



const createDivision = async (payload: Partial<IDivision>) => {
    const { name, slug, thumbnail, description } = payload;    
    const generatedSlug = slug? slug.trim().toLowerCase().replace(/\s+/g, '-'): name?.trim().toLowerCase().replace(/\s+/g, '-');
    const nameExists = await Division.findOne({ where: { name } });
    if (nameExists) {
        throw new AppError(httpStatusCode.BAD_REQUEST, 'Division name already exists','');
    }
    const slugExists = await Division.findOne({ where: { slug: generatedSlug } });
    if (slugExists) {
        throw new AppError(httpStatusCode.BAD_REQUEST, 'Division slug already exists','');
    }
    const division = await Division.create({
        name,
        slug: generatedSlug,
        thumbnail,
        description        
    })
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

const updateDivision = async (divisionId: string, payload: Partial<IDivision>) => {
    // update logic will be implemented here
    const divisionIdExist = await Division.findById(divisionId);
    if (!divisionIdExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Division ID not found", "");
    }


    if (payload.name) {
        payload.slug = payload.name.trim().toLowerCase().replace(/\s+/g, "-");

        const slugExists = await Division.findOne({ slug: payload.slug, _id: { $ne: divisionId } });
        if (slugExists) {
            throw new AppError(httpStatusCode.CONFLICT, "Slug already exists", "");
        }
    
        const nameExists = await Division.findOne({ name: payload.name, _id: { $ne: divisionId } });
        if (nameExists) {
            throw new AppError(httpStatusCode.CONFLICT, "Name already exists", "");
        }
    }

     if (payload.slug) {
        payload.slug = payload.slug.trim().toLowerCase().replace(/\s+/g, "-");
    }


    const division = await Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true });
    if (!division) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Division not found", "");
    }
    return division;
    }
    const deleteDivision = async (divisionId: string) => {
    const divisionIdExist = await Division.findById(divisionId);
    if (!divisionIdExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Division ID not found", "");
    }
    const division = await Division.findByIdAndDelete(divisionId);
    if (!division) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Division not found", "");
    }
    return division;
}

export const divisionService = {
    createDivision,
    getAllDivision,
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

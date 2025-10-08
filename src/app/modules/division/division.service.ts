import { IDivision } from "./division.interface";
import { Division } from "./division.model";


const createDivision = async (payload: Partial<IDivision>) => {
    const {name,slug, ...rest} = payload;
    const generatedSlug = slug? slug.trim().toLowerCase().replace(/\s+/g, '-'): 
    name?.trim().toLowerCase().replace(/\s+/g, '-');

    const division = await Division.create({
        name,
        slug: slug || slugName,
        ...rest
    })
    return division
}


export const divisionService = {
    createDivision
}
export const findOne = async ({model, filter= { } , select= "", options = {},}) =>{
const doc = model.findOne(filter,);
if(select?.length) doc.select(select);
if (options?.populate) doc.populate(options.populate);

if(options?.lean) doc.lean();

return await doc.exec();
}

export const findById = async ({model, id , select= "", options = {},}) =>{
const doc = model.findById(id).select(select);
if (options?.populate) doc.populate(options.populate);

if(options?.lean) doc.lean();

return await doc.exec();
}

export const find = async ({model, filter= { } , select= "", options = {},}) =>{
const doc = model.find(filter).select(select);
if (options?.populate) doc.populate(options.populate);

if(options?.lean) doc.lean();

if (options?.sort) doc.sort(options.sort);

if (options?.limit) doc.limit(options.limit);
if (options?.skip) doc.limit(options.skip);

return await doc.exec();
}


export const creat3  = async ({model, filter= { } , select= "", options = {},}) =>{
const doc = model.find(filter).select(select);
if (options?.populate) doc.populate(options.populate);

if(options?.lean) doc.lean();

if (options?.sort) doc.sort(options.sort);

if (options?.limit) doc.limit(options.limit);
if (options?.skip) doc.limit(options.skip);

return await doc.exec();
}
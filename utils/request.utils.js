exports.checkRequiredFields = (requiredFields, body) => {
    const fieldsWithErrors = [];
    for(const field of requiredFields) {
        if(!body[field]) {
            fieldsWithErrors.push(field);
        }
    }
    return fieldsWithErrors;
}
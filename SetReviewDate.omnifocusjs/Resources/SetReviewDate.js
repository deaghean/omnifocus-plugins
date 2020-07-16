var _ = function() {
    const action = new PlugIn.Action(function() {

        const folderIds = [];
        const folderNames = [];
        const buildFolderList = (folderGroup, prefix) => {
            if (typeof folderGroup === 'undefined') {
                folderGroup = folders;
            }
            if (typeof prefix === 'undefined') {
                prefix = '';
            }

            if (folderGroup.length > 0) {
                for (let i = 0; i < folderGroup.length; i++) {
                    let fullPath = prefix + folderGroup[i].name;
                    if (folderGroup[i].flattenedProjects.length > 0) {
                        folderIds.push(folderGroup[i].id.primaryKey);
                        folderNames.push('Folder: ' + fullPath);
                    }
                    buildFolderList(folderGroup[i].folders, fullPath + ' : ');
                }
            }
        };
        buildFolderList();

        const newReviewDate = new Date();
        newReviewDate.setHours(0,0,0,0); // Reset time to midnight
        const datePickerForm = new Form();
        const dateFormatter = Formatter.Date.withStyle(Formatter.Date.Style.Short, null);
        const datePickerField = new Form.Field.Date('reviewDate', 'New Review Date', newReviewDate, dateFormatter);
        datePickerForm.addField(datePickerField);
        if (folderIds.length > 0) {
            const selectedFolderField = new Form.Field.Option('selectedFolder', 'Set Date for', folderIds, folderNames);
            selectedFolderField.allowsNull = true;
            selectedFolderField.nullOptionTitle = 'All Projects';
            datePickerForm.addField(selectedFolderField);
        }
        const datePickerPromise = datePickerForm.show('Choose a New Review Date', 'Select Date');
        
        datePickerPromise.then(function(form) {
            let container = flattenedProjects;
            if (form.values.selectedFolder) {
                container = Folder.byIdentifier(form.values.selectedFolder).flattenedProjects;
            }
            container.forEach((project) => {
                project.nextReviewDate = form.values.reviewDate;
            });
        });
    });

    action.validate = function(){
        return (flattenedProjects.length > 0);
    };

    return action;
}();
_;
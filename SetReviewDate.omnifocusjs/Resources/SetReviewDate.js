(() => {
    return new PlugIn.Action(() => {
    
        // Reusable filter to limit projects to active and on hold
        const reviewProjectFilter = (projectObject) => {
            return (projectObject.status === Project.Status.Active || projectObject.status === Project.Status.OnHold);
        }
        
        // Recursively collect a list of folder ids and names that contain full paths
        const folderIds = [],
              folderNames = [];
              
        const buildFolderList = (folderList = folders, previousFolderHierarchyName = '') => {
            folderList.forEach((folderObject) => {
                const fullName = previousFolderHierarchyName + folderObject.name;
                
                // Only add the folder if it has active/on hold projects within
                if (folderObject.flattenedProjects.filter(reviewProjectFilter).length > 0) {
                    folderIds.push(folderObject.id.primaryKey);
                    folderNames.push('Folder: ' + fullName);
                }
                
                buildFolderList(folderObject.folders, fullName + ' : ');
            });
        };
        buildFolderList();

        // Setup form and date field
        const reviewDateForm = new Form();
              dateFormatter = Formatter.Date.withStyle(Formatter.Date.Style.Short, null);
              datePickerField = new Form.Field.Date('reviewDate', 'New Review Date', new Date(), dateFormatter);
              
        reviewDateForm.addField(datePickerField);
        
        // Add folder list to the options if there are any
        if (folderIds.length > 0) {
            const selectedFolderField = new Form.Field.Option('selectedFolder', 'Set Date for', folderIds, folderNames);
            selectedFolderField.allowsNull = true;
            selectedFolderField.nullOptionTitle = 'All Projects';
            reviewDateForm.addField(selectedFolderField);
        }
        
        // Show the form and set the apply the new date when fired
        const reviewDateFormPromise = reviewDateForm.show('Choose a New Review Date', 'Select Date');
        
        reviewDateFormPromise.then(function(form) {
            const projectList = (form.values.selectedFolder ? Folder.byIdentifier(form.values.selectedFolder).flattenedProjects : flattenedProjects); 
            
            projectList.filter(reviewProjectFilter).forEach((projectObject) => {
                projectObject.nextReviewDate = form.values.reviewDate;
            });
        });
    });
})();
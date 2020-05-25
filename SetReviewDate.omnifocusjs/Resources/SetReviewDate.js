var _ = function() {
    var action = new PlugIn.Action(function() {
        let newReviewDate = new Date();
        newReviewDate.setHours(0,0,0,0); // Reset time to midnight
        let datePickerForm = new Form();
        let datePicker = new Form.Field.Date('reviewDate', 'New Review Date', newReviewDate);
        datePickerForm.addField(datePicker);
        let datePickerPromise = datePickerForm.show('Choose a New Review Date for All ' + flattenedProjects.length + ' Projects', 'Select Date');
        
        datePickerPromise.then(function(form) {
            newReviewDate = form.values.reviewDate;
            flattenedProjects.forEach((project) => {
                project.nextReviewDate = newReviewDate;
            });
        });
    });

    action.validate = function(){
        return (flattenedProjects.length > 0);
    };

    return action;
}();
_;
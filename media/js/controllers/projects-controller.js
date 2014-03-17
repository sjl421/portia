ASTool.ProjectsIndexController = Em.ArrayController.extend(ASTool.BaseControllerMixin, {
	needs: ['application'],

	projectSite: null,

	createProjectDisabled: function() {
		return Em.isEmpty(this.get('projectSite'));
	}.property('projectSite'),

	actions: {
		
		openProject: function(projectName) {
			this.set('slyd.project', projectName);
			this.transitionToRoute('project', { id: projectName });
		},

		deleteProject: function(projectName) {
			if (confirm('Are you sure you want to delete this project? This operation cannot be undone.')) {
				this.get('slyd').deleteProject(projectName);
				this.removeObject(projectName);
			} 
		},

		createProject: function() {
			var newProjectName = this.getUnusedName('new_project', this.get('content'));
			this.get('slyd').createProject(newProjectName).then(function() {
				this.set('slyd.project', newProjectName);
				// Initialize items spec.
				this.get('slyd').saveItems([
					ASTool.Item.create({ name: 'default', fields: [ ]
					})
				]);
				// Initialize extractors spec.
				this.get('slyd').saveExtractors([]);
				// Setup automatic creation of an initial spider.
				this.set('controllers.application.siteWizard', this.get('projectSite'));
				this.set('projectSite', null);
				this.transitionToRoute('project', { id: newProjectName });
			}.bind(this));
		}
	},

	willEnter: function() {
		this.get('documentView').showSpider();
	}
});

$(() => {
	let cloud = window.location.hostname.split('.')[0]; // Get cloud name
	let cloudURL = `https://${cloud}.team22.sweispring21.tk`;

	$("#logInButton").click(() => {
		let username = $("#username").val().trim();
		let password = $("#password").val();

		$('#errorAlert').addClass('d-none');
		$('.card-body').addClass('was-validated');
		let errorVisible = $('.invalid-feedback:visible').length
		if (errorVisible !== 0) {
			console.log("There are currently errors in validation. User needs to fix those errors before proceeding.")
			return
		}

		let hashedPassword = hash(username.toLowerCase(), password)

		let data = {
			'cloud': cloud,
			'username': username.toLowerCase(),
			'password': hashedPassword
		};

		fetch(cloudURL + "/api/v1/common-services/login", {
			method:"POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(response => {
			if (response.ok) {
				return response;
			}
			return Promise.reject(response)
		}).then(data => {
			window.location.replace(cloudURL + `/${cloud}-frontend/dashboard.html`);
		}).catch(error => {
			console.warn('Something went wrong.', error);
			if (error.status === 401) {
				$('#errorAlert').removeClass('d-none').text('Incorrect username or password.');
			} else {
				$('#errorAlert').removeClass('d-none').text('There was an error communicating with the server.');
				// TODO: Handle error based on status code
			}
		});
	});
});
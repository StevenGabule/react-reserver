import React from 'react';
import {
	Button,
	Form,
	Icon,
	Message,
	Segment
} from 'semantic-ui-react';
import Link from 'next/link';
import catchErrors from '../utils/catchErrors';
import baseUrl from '../utils/baseUrl';
import { handleLogin } from '../utils/auth';
import axios from 'axios';

const INITIAL_USER = {
	email: "johnpaulgabule@gmail.com",
	password: "password"
}

function Login() {
	const [user, setUser] = React.useState(INITIAL_USER);
	const [disabled, setDisabled] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		const isUser = Object.values(user).every(el => Boolean(el));
		isUser ? setDisabled(false) : setDisabled(true);
	}, [user]);

	function handleChange(e) {
		const { name, value } = e.target;
		setUser(prevState => ({ ...prevState, [name]: value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setLoading(true);
			setError('');
			const url = `${baseUrl}/api/login`;
			const payload = { ...user };
			const response = await axios.post(url, payload);
			handleLogin(response.data);
		} catch (err) {
			catchErrors(err, setError);
		} finally {
			setLoading(false);
		}
	}

	return <>
		<Message
			attached
			icon="privacy"
			header="Welcome back!"
			content="Log in with email and password"
			color="blue" />

		<Form error={Boolean(error)} onSubmit={handleSubmit} loading={loading}>
			<Message error header="Oops!" content={error} />
			<Segment>

				<Form.Input
					fluid icon="envelope"
					iconPosition="left"
					label="Email"
					placeholder="Email"
					type="email"
					value={user.email}
					name="email"
					onChange={handleChange}
				/>

				<Form.Input
					fluid icon="lock"
					iconPosition="left"
					label="Password" type="password"
					placeholder="Password"
					value={user.password}
					name="password"
					onChange={handleChange}
				/>
				<Button disabled={disabled || loading} icon="sign in" type="submit" color="orange" content="Login" />
			</Segment>
		</Form>
		<Message attached="bottom" warning>
			<Icon name="help" />
			 New user? {" "}
			<Link href="/signup">
				<a>Sign up here</a>
			</Link>{" "} instead.
		</Message>
	</>;
}

export default Login;

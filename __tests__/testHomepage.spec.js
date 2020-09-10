import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import Homepage from '../react/homepage';

describe("First Test", ()=> {
	it("renders without crashing", ()=> {
		const div = document.createElement("div");
		ReactDOM.render(<Homepage></Homepage>, div)
	});

	it("the header contains the name of the game", ()=> {
		const wrapper = render(<Homepage></Homepage>)
			expect(wrapper.getByTestId('123').textContent).toEqual('The Envelope Game');
	});
});

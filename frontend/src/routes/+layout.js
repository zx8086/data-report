// src/routes/+layout.js
import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {

	if (browser) {
		posthog.init(
			'phc_qmqwPLsWmycDSEzZqEYoYVj4fVl8JuEO8wjaxTfezTh',
			{
				api_host:"https://eu.i.posthog.com",
				capture_pageview: false,
				capture_pageleave: false
			}
		)
	}
	return
};
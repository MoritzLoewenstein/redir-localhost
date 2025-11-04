import assert from "node:assert";
import { test } from "node:test";

const BASE_URL = "http://localhost:3000";

test("redirects to http localhost URL with query params", async () => {
	const res = await fetch(`${BASE_URL}/http://localhost:8080?foo=bar&baz=qux`, {
		redirect: "manual",
	});

	assert.strictEqual(res.status, 302);
	assert.strictEqual(
		res.headers.get("location"),
		"http://localhost:8080/?foo=bar&baz=qux",
	);
});

test("redirects to http localhost URL with port and path", async () => {
	const res = await fetch(
		`${BASE_URL}/http:/localhost:9000/api/test?param=value`,
		{
			redirect: "manual",
		},
	);

	assert.strictEqual(res.status, 302);
	assert.strictEqual(
		res.headers.get("location"),
		"http://localhost:9000/api/test?param=value",
	);
});

test("redirects to http localhost URL without query params", async () => {
	const res = await fetch(`${BASE_URL}/http://localhost:4000`, {
		redirect: "manual",
	});

	assert.strictEqual(res.status, 302);
	assert.strictEqual(res.headers.get("location"), "http://localhost:4000/");
});

test("redirects to https localhost URL with port and path", async () => {
	const res = await fetch(
		`${BASE_URL}/https:/localhost:9000/api/test?param=value`,
		{
			redirect: "manual",
		},
	);

	assert.strictEqual(res.status, 302);
	assert.strictEqual(
		res.headers.get("location"),
		"https://localhost:9000/api/test?param=value",
	);
});

test("returns 422 when no URL parameter provided", async () => {
	const res = await fetch(BASE_URL);

	assert.strictEqual(res.status, 422);
	const body = await res.text();
	assert.strictEqual(body, "no url provided");
});

test("returns 403 when URL is not localhost", async () => {
	const res = await fetch(`${BASE_URL}/http://example.com:8080`, {
		redirect: "manual",
	});

	assert.strictEqual(res.status, 403);
	const body = await res.text();
	assert.strictEqual(body, "only localhost http or https redirect allowed");
});

test("returns 403 when trying to redirect to external domain", async () => {
	const res = await fetch(`${BASE_URL}/https://malicious.com`, {
		redirect: "manual",
	});

	assert.strictEqual(res.status, 403);
	const body = await res.text();
	assert.strictEqual(body, "only localhost http or https redirect allowed");
});

test("returns 403 when trying to redirect to an invalid protocol", async () => {
	const res = await fetch(`${BASE_URL}/prot://localhost`, {
		redirect: "manual",
	});

	assert.strictEqual(res.status, 403);
	const body = await res.text();
	assert.strictEqual(body, "only localhost http or https redirect allowed");
});

test("returns 405 for POST requests", async () => {
	const res = await fetch(`${BASE_URL}/http://localhost:8080`, {
		method: "POST",
	});

	assert.strictEqual(res.status, 405);
	const body = await res.text();
	assert.strictEqual(body, "method not allowed");
});

test("returns 405 for PUT requests", async () => {
	const res = await fetch(`${BASE_URL}/http://localhost:8080`, {
		method: "PUT",
	});

	assert.strictEqual(res.status, 405);
	const body = await res.text();
	assert.strictEqual(body, "method not allowed");
});

test("returns 405 for DELETE requests", async () => {
	const res = await fetch(`${BASE_URL}/http://localhost:8080`, {
		method: "DELETE",
	});

	assert.strictEqual(res.status, 405);
	const body = await res.text();
	assert.strictEqual(body, "method not allowed");
});

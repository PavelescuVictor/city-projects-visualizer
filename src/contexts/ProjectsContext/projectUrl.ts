const PROJECT_SEARCH_PARAM = "project";

function getProjectIdFromUrl() {
	return new URLSearchParams(window.location.search).get(PROJECT_SEARCH_PARAM) ?? "";
}

function getUrlWithProjectId(projectId: string) {
	const url = new URL(window.location.href);
	url.searchParams.set(PROJECT_SEARCH_PARAM, projectId);

	return url;
}

function getUrlWithoutProjectId() {
	const url = new URL(window.location.href);
	url.searchParams.delete(PROJECT_SEARCH_PARAM);

	return url;
}

function pushProjectUrl(projectId: string) {
	if (getProjectIdFromUrl() === projectId) {
		return;
	}

	window.history.pushState(null, "", getUrlWithProjectId(projectId));
}

function pushCleanProjectUrl() {
	if (!getProjectIdFromUrl()) {
		return;
	}

	window.history.pushState(null, "", getUrlWithoutProjectId());
}

function replaceCleanProjectUrl() {
	window.history.replaceState(null, "", getUrlWithoutProjectId());
}

export { getProjectIdFromUrl, pushCleanProjectUrl, pushProjectUrl, replaceCleanProjectUrl };

// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
	id: number;
  	login: string;
  	avatar_url: string;
  	html_url: string;
  	name?: string;
  	location?: string;
  	email?: string;
  	company?: string;
  	bio?: string;
  	followers: number;
  	following: number;
  	public_repos: number;
  	created_at: string;
  	updated_at: string;
  	reject?: boolean;
}

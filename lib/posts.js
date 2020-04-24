import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
	//Get file name under post
	const fileNames = fs.readdirSync(postDirectory);
	const allPostData = fileNames.map((fileName) => {
		//Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, "");

		//Read markdown file as string
		const fullPath = path.join(postDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");

		//Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		//Combine data with id
		return {
			id,
			...matterResult.data,
		};
	});
	//Sort posts by date
	return allPostData.sort((a, b) => {
		return a.date < b.date ? 1 : -1;
	});
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postDirectory);

	return fileNames.map((fileName) => {
		return {
			params: {
				id: fileName.replace(/\.md$/, ""),
			},
		};
	});
}

export async function getPostData(id) {
	const fullPath = path.join(postDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf8");
	const matterResult = matter(fileContents);

	//Use remark to convert markdown into HTML string
	const processedContent = await remark().use(html).process(matterResult.content);
	const contentHtml = processedContent.toString();

	return {
		id,
		contentHtml,
		...matterResult.data,
	};
}

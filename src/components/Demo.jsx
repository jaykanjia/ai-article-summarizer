import React, { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "../services/article";
import { copy, linkIcon, loader, tick, search, logo } from "../assets";

const Demo = () => {
	const [article, setArticle] = useState({
		url: "",
		summary: "",
	});
	const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

	const allArticles = JSON.parse(localStorage.getItem("articles")) || null;

	useEffect(() => {
		if (allArticles && allArticles.length > 0) {
			const data = { url: allArticles[0].url, summary: allArticles[0].summary };
			setArticle(data);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { data } = await getSummary({ articleUrl: article.url });

		if (data?.summary) {
			const newArticle = { ...article, summary: data.summary };

			const updatedAllArticles = [newArticle, ...allArticles];

			setArticle(newArticle);
			console.log(updatedAllArticles);

			localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
		}
	};

	return (
		<section className="mt-16 w-full max-w-xl">
			{/* search */}
			<div className="flex flex-col w-full gap-2">
				<form
					className="relative flex justify-center items-center"
					onSubmit={(e) => handleSubmit(e)}
				>
					<img
						src={linkIcon}
						alt="link_icon"
						className="absolute left-0 my-2 ml-3 w-5"
					/>
					<label htmlFor="search" className="sr-only">
						search bar
					</label>
					<input
						className="url_input peer"
						type="url"
						name="search"
						id="search"
						placeholder="Enter a url"
						value={article.url}
						onChange={(e) => {
							setArticle((prev) => ({ ...prev, url: e.target.value }));
						}}
					/>
					<button
						className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
						type="submit"
					>
						<img
							src={search}
							alt="search_icon"
							className="w-[40%] aspect-square object-contain"
						/>
					</button>
				</form>

				{/* browse url history */}
				<div className="flex flex-col gap-1 max-h-56 overflow-y-scroll bg-gray-100">
					{allArticles &&
						allArticles.map((item, index) => {
							return (
								<div
									key={`link-${index}`}
									className="link_card"
									onClick={() => {
										setArticle(item);
									}}
								>
									<div className="copy_btn w-6 aspect-square">
										<img
											src={copy}
											alt="copy_icon"
											className="w-[40%] aspect-square object-contain"
										/>
									</div>
									<p
										title={item.url}
										className="font-satoshi font-normal text-blue-700 text-sm truncate"
									>
										{item?.url}
									</p>
								</div>
							);
						})}
				</div>
				{/* <div>
					{allArticles &&
						allArticles?.map((item, index) => {
							return (
								<div
									key={`link-${index}`}
									onClick={() => setArticle(item)}
									className="link_card"
								>
									<div className="copy_btn">
										<img
											src={copy}
											alt="copy_icon"
											className="w-[40%] aspect-square object-contain"
										/>
									</div>
									<p
										title={item.url}
										className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate"
									>
										{item.url}
									</p>
								</div>
							);
						})}
				</div> */}
			</div>
			{/* display result */}
			<div className="my-10 max-w-full flex justify-center items-center">
				{isFetching ? (
					<img
						src={loader}
						alt="loader"
						className="w-20 aspect-square object-contain"
					/>
				) : error ? (
					<p className="font-inter font-bold text-black text-center">
						Well, that's wasn't supposed to happen... <br />
						<span className="font-satoshi font-normal text-gray-700">
							{error?.data?.error}
						</span>
					</p>
				) : (
					article.summary && (
						<div className="flex flex-col gap-3">
							<h2 className="font-satoshi font-bold text-gray-600 text-xl">
								Artical <span className="blue_gradient">Summary</span>
							</h2>
							<div className="summary_box">
								<p className="font-inter font-medium text-sm text-gray-700">
									{article.summary}
								</p>
							</div>
						</div>
					)
				)}
			</div>
		</section>
	);
};

export default Demo;

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import WpImage from "@/components/WpImage";

function Header({
  menu,
  options,
  latestPosts,
}: {
  menu: any;
  options: any;
  latestPosts: any;
}) {
  const [headerState, setHeader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleHeader = () => {
    setHeader(!headerState);
  };

  const closeHeader = () => {
    setHeader(false);
  };

  useEffect(() => {
    const content = document.getElementById("content");
    if (content) {
      if (headerState) {
        content.classList.add("h-0");
        content.classList.add("lg:h-max");
        content.classList.add("lg:min-h-screen");
        content.classList.add("overflow-hidden");
        content.classList.add("lg:overflow-auto");
      } else {
        content.classList.remove("h-0");
        content.classList.remove("lg:h-max");
        content.classList.remove("lg:min-h-screen");
        content.classList.remove("overflow-hidden");
        content.classList.remove("lg:overflow-auto");
      }
    }
  }, [headerState]);

  useEffect(() => {
    const handleClick = () => {
      // Call closeHeader function
      closeHeader();
    };

    // Add event listener to all anchor elements
    const anchors = document.querySelectorAll("a");
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleClick);
    });

    // Clean up the event listeners on component unmount
    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleClick);
      });
    };
  }, [router.asPath]);

  const handleSearch = () => {
    // Replace spaces with '+' in the search query
    const formattedQuery = searchQuery.split(" ").join("+");
    // Use the router to push the new URL without reloading the [slug]
    router.push(`/search/${formattedQuery}`);
  };

  menu.forEach((item: any) => {
    item.menu_item_parent = parseInt(item.menu_item_parent, 10);
  });
  // Create a hierarchy based on the parent-child relationship
  const createHierarchy = (items: any, parentId = 0) =>
    items
      .filter((item: any) => item.menu_item_parent === parentId)
      .map((item: any) => ({
        ...item,
        children: createHierarchy(items, item.ID),
      }));

  // ...

  const hierarchy = createHierarchy(menu);

  // Render a menu item and its children
  const renderMenuItem = (item: any) => (
    <li key={item.ID}>
      <Link
        href={item.url.replace(
          process.env.WORDPRESS_HOST,
          process.env.FRONTEND_HOST,
        )}
        target={item.target ? item.target : "_self"}
        className={`relative block pr-2 leading-loose text-bright-sun-400 transition-all hover:bg-bright-sun-400 hover:pl-4 hover:text-black`}
        onClick={closeHeader}
      >
        {item.menu_item_parent > 0 && (
          <svg
            viewBox="0 0 492 726"
            height={16}
            className={`absolute -left-4 bottom-0 top-0 my-2 scale-75 fill-white/10`}
          >
            <path d="M173 552h318v173H0V0h173v552Z" />
          </svg>
        )}
        {item.title}
      </Link>
      {item.children.length > 0 && (
        <ul className={`flex list-none flex-col pl-4`}>
          {item.children.map((child: any) => renderMenuItem(child))}
        </ul>
      )}
    </li>
  );

  // Render the top-level menu items
  const renderMenuItems = hierarchy.filter(
    (item: any) => item.menu_item_parent === 0,
  );

  return (
    <header
      className={`w-full lg:sticky lg:top-0 lg:w-1/3 xl:w-1/4 2xl:w-1/5 ${headerState ? "closed" : "open"} h-auto max-h-[100dvh] overflow-hidden font-sans lg:h-[100dvh]`}
    >
      <div
        className={`w-full ${headerState ? "h-[calc(100%_-_2.5rem)]" : "h-full"} transform-gpu bg-black/80 backdrop-blur-md backdrop-saturate-200 transition-transform`}
      >
        <button
          onClick={toggleHeader}
          className={`flex flex-row ${headerState ? "text-white/50" : "text-bright-sun-400"} mx-auto my-0 max-w-max px-4 pb-3 pt-7`}
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            className={`my-1 inline-flex fill-current`}
          >
            <path
              d={
                headerState
                  ? `M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`
                  : `M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z`
              }
            />
          </svg>
          <span className={`inline-flex pl-1 uppercase`}>
            <span
              className={
                headerState
                  ? `max-w-full overflow-hidden pr-1 transition-[width,padding]`
                  : `max-w-0 overflow-hidden transition-[width,padding]`
              }
            >
              Hide
            </span>
            Menu
          </span>
        </button>
        <div
          className={`inner grid w-full grid-rows-[repeat(2,auto)] lg:w-[200%] lg:grid-cols-2 ${headerState ? "max-h-[calc(100dvh_-_4rem)] overflow-y-auto" : "max-h-0 lg:max-h-fit lg:-translate-x-1/2"} transform-gpu transition-all`}
        >
          <div
            className={`menu-section h-auto px-6 lg:h-[calc(100dvh-4em)] ${headerState ? "lg:pb-8" : ""} overflow-y-auto transition-all scrollbar-thin scrollbar-track-black scrollbar-thumb-white/25 lg:order-1 xl:transition-none`}
          >
            <h3 className={`text-md mb-4 mt-8 uppercase text-white/50`}>
              Navigation
            </h3>
            <ul className={`mb-6 flex list-none flex-col`}>
              {renderMenuItems.map((item: any) => renderMenuItem(item))}
            </ul>
            <h3 className={`text-md my-4 uppercase text-white/50`}>Latest</h3>
            {latestPosts && (
              <ul className={`flex list-none flex-col gap-2`}>
                {latestPosts.map((post: any) => (
                  <li key={post.id}>
                    <Link
                      className={`text-bright-sun-400 transition-colors hover:text-bright-sun-500`}
                      href={`/${post.slug}`}
                      onClick={closeHeader}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    ></Link>
                  </li>
                ))}
              </ul>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission behavior
                // Call the search handler with the new query
                handleSearch();
              }}
              action={`/search/${searchQuery}`} // Optional: You can set the action attribute to the desired URL if needed
              className={`my-6 flex flex-row overflow-hidden rounded-md`}
            >
              <input
                type={`search`}
                name={`s`}
                placeholder={`Search`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-none px-4 py-2 placeholder:uppercase`}
              />
              <button type={`submit`} className={`bg-bright-sun-400 px-6 py-2`}>
                <svg
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className={`fill-bright-sun-700`}
                >
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </button>
            </form>
          </div>
          <div
            className={`home-section -order-1 h-auto overflow-y-auto lg:order-2 xl:h-[calc(100dvh-4em)]`}
          >
            {options && (
              <>
                <Link
                  href={`/`}
                  title={options.name}
                  className={`mx-auto block max-w-max`}
                  onClick={closeHeader}
                >
                  <WpImage
                    url={options.site_logo_url}
                    src={{
                      "": [
                        {
                          width: 128,
                          height: 128,
                        },
                      ],
                    }}
                    className={`rounded-full`}
                    alt={options.name}
                    focalPoint={[50, 50]}
                    size={[128, 128]}
                  />
                </Link>
                <Link
                  href={`/`}
                  onClick={closeHeader}
                  className={`mx-auto mb-2 mt-6 block max-w-max rounded px-1.5 py-1 text-center text-xl font-bold leading-tight text-bright-sun-400 transition-colors hover:bg-bright-sun-400 hover:text-black`}
                >
                  <span className={`hidden lg:block`}>{options.name}</span>
                  <span className={`block lg:hidden`}>{options.shortname}</span>
                </Link>
                <p
                  className={`mx-auto mb-6 mt-0 max-w-max text-lg text-white/50`}
                >
                  {options.description}
                </p>
                <hr
                  className={`mx-auto mb-6 mt-0 h-1.5 w-1/2 rounded-sm border-none bg-white/10`}
                />
                {options.site_connect && (
                  <>
                    <p
                      className={`mx-auto mb-4 mt-0 max-w-max text-lg text-white/50`}
                    >
                      Connect
                    </p>
                    <ul
                      className={`mx-auto my-0 mb-6 flex max-w-max list-none flex-row gap-1.5 p-0 text-white/50 hover:[&_a]:text-white`}
                    >
                      {options.site_connect.map(
                        (connection: any, index: number) => (
                          <li key={index}>
                            <a
                              target={connection.link.target}
                              className={`transition-colors`}
                              href={connection.link.href}
                            >
                              {parse(connection.icon)}
                            </a>
                          </li>
                        ),
                      )}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {options.site_background_credit && (
        <div
          className={`absolute inset-0 top-auto hidden h-10 flex-col justify-center bg-white/10 align-middle backdrop-blur-md backdrop-brightness-50 lg:flex ${headerState ? "translate-y-0" : "translate-y-full"} transition-transform`}
        >
          <span
            className={`inline-block px-2 py-1 text-center text-xs text-white 2xl:text-sm`}
          >
            Background {options.site_background_credit}
          </span>
        </div>
      )}
    </header>
  );
}

export default Header;

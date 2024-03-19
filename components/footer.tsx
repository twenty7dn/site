function Footer({loadMore, options}: {loadMore: any, options: any}) {
    return (
        <footer className={`relative flex flex-col md:flex-row gap-3 py-6 px-8 mt-auto text-sm uppercase tracking-wider bg-white border-t border-t-black/10 z-10 font-sans`}>
            <span className={`hidden xl:inline-flex`}>{options.site_footer.desktop}</span>
            <span className={`md:inline-flex xl:hidden text-center md:text-left`}>{options.site_footer.mobile}</span>
            <span
                className={`mx-auto md:ml-auto md:mr-0`}
            >
                {loadMore && loadMore}
            </span>
        </footer>
    );
}

export default Footer;
let libraryLoaded = false;
let allFiles = [];


async function loadFiles(force = false) {

    /* Don't reload if already loaded */
    if (libraryLoaded && !force) {
        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("files")
            .select(`
                id,
                title,
                description,
                category,
                file_name,
                file_path,
                file_type,
                file_size,
                created_at
            `)
            .order("created_at", {
                ascending: false
            })
            .limit(50);

        if (error) {
            console.error(error);
            showError(error.message);
            return;
        }

        allFiles = data || [];

        libraryLoaded = true;

        renderFiles(allFiles);

    } catch (error) {

        console.error(error);

        showError(
            "Unable to load the library."
        );

    }

}

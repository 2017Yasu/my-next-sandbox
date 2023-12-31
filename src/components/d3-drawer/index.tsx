import dynamic from "next/dynamic";

const D3Drawer = dynamic(() => import('./d3-drawer'), {
    ssr: false,
    loading: () => <p>Loading...</p>
})

export default D3Drawer

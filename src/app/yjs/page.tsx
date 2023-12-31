import Link from "next/link";

export default function YjsPage() {
    return (
        <div>
            <Link href='/'>&lt;- Go Back</Link>
            <div>
                <ul>
                    <li>
                        <Link href='/yjs/quill'>Quill</Link>
                    </li>
                    <li>
                        <Link href='/yjs/draw'>Draw</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

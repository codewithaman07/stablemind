import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: '#10a37f',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: 8,
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C12 9.52285 7.52285 14 2 14C7.52285 14 12 18.4772 12 24C12 18.4772 16.4772 14 22 14C16.4772 14 12 9.52285 12 4Z" fill="white" transform="translate(0, -2)" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}

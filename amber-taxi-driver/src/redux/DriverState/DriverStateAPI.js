// A mock function to mimic making an async request for data
export function fetchDriveState(state = "online") {
    return new Promise((resolve) =>
        setTimeout(() => resolve({ data: state }), 500)
    );
}
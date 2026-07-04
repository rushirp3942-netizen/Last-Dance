import streamlit as st
import streamlit.components.v1 as components

# Configure Streamlit page parameters
st.set_page_config(
    page_title="Spotify Smart Shuffle 2.0 UX Prototype",
    page_icon="🎧",
    layout="centered"
)

# Custom CSS to align Streamlit styling with Spotify branding
st.markdown(
    """
    <style>
    /* Dark theme overrides */
    .stApp {
        background-color: #0b0b0b !important;
        color: #ffffff !important;
    }
    
    /* Header alignments */
    h1 {
        color: #1DB954 !important;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-weight: 800;
        margin-bottom: 4px !important;
    }
    
    /* Description paragraph */
    div[data-testid="stMarkdownContainer"] p {
        text-align: center;
        color: #A7A7A7;
        font-size: 14px;
        margin-bottom: 24px;
    }
    
    /* Center the iframe component */
    iframe {
        border: none !important;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        display: block;
        margin: 0 auto;
    }
    
    /* Hide Streamlit elements for a clean dashboard look */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
    """,
    unsafe_allow_html=True
)

st.title("Spotify Smart Shuffle 2.0")
st.write("An interactive high-fidelity UX prototype showcasing discovery mode levels, transparency indicators, and smart recommendations.")

# Embed the deployed GitHub Pages version which handles mobile framing and responsive resizing
components.iframe("https://rushirp3942-netizen.github.io/Last-Dance/", height=860, scrolling=False)

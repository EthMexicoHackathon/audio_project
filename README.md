# Music_Sharing_Social_Network

# Overview

The Lens social graph has the power to revolutionize the music experience for both fans and artists. Fans will have new ways to discover music, find like minded fans, and experience music together. Artists will have new ways to deepen their fan connection, and new options for commercializing their creations.

Most artists struggle to make a viable living on today’s platforms, due to the highly competitive nature of being seen on those platforms, and the debilitating fees involved, with $0.88 of every revenue dollar going to stakeholders other than the artist. Releasing content on-chain opens up new possibilities for monetization.

# Implementation

We used ConnectKit for connecting wallets. It allows us to connect using WalletConnect, Metamask and other wallets. For the frontend we used Create-React-App and added tailwind css for styling. We connected the app to lens protocol and allowed users to signin with lens, create profiles, and make publications. We use Apollo client for fetching data and making mutations to the lens protocol. For streaming of revenue to authors of a song we use SuperFluid and the app lives on the polygon mumbai blockchain. For storage of metadata we use IPFS.

# Reference

- https://ideas.lens.xyz/music

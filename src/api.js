const direction = {
  front: 1,
  left: 2,
  right: 5,
  back: 6,
}

export const api = {
  getAllRoutes: '/get_all_routes/',
  getRouteInfo: id => `/get_route_info/${ id }/`,
  getImage: (id, dir) => `/get_image_by_name/${ id }${ direction[dir] }.jpg`
}

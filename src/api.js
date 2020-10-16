const direction = {
  front: 1,
  left: 2,
  right: 5,
  back: 6,
}

export const api = {
  logout: '/logout/',
  updateAccount: '/accounts/update/2/',
  getAllRoutes: '/get_all_routes/',
  getRouteInfo: id => `/get_route_info/${ id }/`,
  getImage: (id, dir) => `/get_image_by_name/${ id }${ direction[dir] }.jpg`,
  getAnnotationSet: '/get_annotation_set/',
  saveAnnotations: '/save_annotations/',
  getImageAnnotations: id => `/get_image_annotations/${ id }/`
}
